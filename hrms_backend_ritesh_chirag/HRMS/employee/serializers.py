
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CompanyRelations,EmployeeDocuments,DailyAttendanceReport,Breaks,Attendence,TodaysEmployeeActivity,Notification
from authApp.models import Employee
from authApp.serializers import EmployeeSerializer,AttendanceSpecificDataSerializer
from datetime import date 
from leaves.models import Leaves
from django.db.models import Sum,F,ExpressionWrapper,DurationField
from django.db.models import Count
from datetime import datetime, timedelta, date, time
import calendar
#created By Ritesh
class LogsSerializer(serializers.ModelSerializer):
   
    breaks = serializers.SerializerMethodField()
    class Meta:
        model = Attendence
        fields = ['checkIn','checkOut','breaks']
    def get_breaks(self,obj):        
        breaksData = Breaks.objects.filter(employee_id = obj.employee_id_id,date = date.today()).values("breakIn","breakOut")        
        return breaksData

class RelationsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyRelations
        fields = ['id', 'designation', 'department', 'batch', 'joining_date', 'probation_end_date', 'work_duration', 'is_deleted'] 

#created By Ritesh   
class LatestActivitiesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TodaysEmployeeActivity
        fields = ['id','first_name','last_name','status','status_time']

class HotlineEmployeeSerializer(serializers.ModelSerializer):
    relation = serializers.SerializerMethodField()
    class Meta:
        model = Employee
        fields = ['id','first_name','last_name','bio','profile','relation']
    def get_relation(self,obj):    
        return CompanyRelations.objects.filter(employee_id_id=obj.id).values("designation","department")
class HotlineLeaveSerializer(serializers.ModelSerializer):
    profileImage = serializers.SerializerMethodField()
    designation = serializers.SerializerMethodField()
    class Meta:
        model = Leaves  
        fields = ['date','profileImage','designation']
    def get_profileImage(self, obj):
        return Employee.objects.filter(id = obj.employee_id_id).values("profile","bio","first_name","last_name")

    def get_designation(self, obj):          
        return CompanyRelations.objects.filter(employee_id=obj.employee_id_id).values("designation", "department")
class HotlineSerializer(serializers.ModelSerializer):
    profileImage = serializers.SerializerMethodField()
    designation = serializers.SerializerMethodField()

    class Meta:
        model = TodaysEmployeeActivity
        fields = ['id', 'first_name', 'last_name', 'status', 'status_time', 'profileImage', 'designation']

    def get_profileImage(self, obj):
        return Employee.objects.filter(id = obj.employee_id_id).values("profile","bio")

    def get_designation(self, obj):    
          
        return CompanyRelations.objects.filter(employee_id=obj.employee_id_id).values("designation", "department")
    
    
#created By Ritesh
class EmployeeDailyActivitiesSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = TodaysEmployeeActivity
        fields = ['id','first_name','last_name','status','status_time']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=Employee
        fields=["first_name","last_name","is_superuser"]

#created By Ritesh
class NotificationSerializer(serializers.ModelSerializer):
    total_notification = serializers.SerializerMethodField()
    employee_id = UserSerializer(read_only=True)
    class Meta:
        model = Notification
        fields = ['id', 'status', 'message', 'is_Read', 'request_admin', 'total_notification', 'employee_id']

    def get_total_notification(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if request.user.is_superuser:            
                notificationCount = Notification.objects.filter(is_Read=False, request_admin=True).count()              
            else:              
                notificationCount = Notification.objects.filter(is_Read=False, request_admin=False).count()
            return notificationCount
        return 0 

    def get_employee(self, obj):
        employee = Employee.objects.all()
        return employee

class UpdateAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyAttendanceReport
        fields = ['id','entry_time','exit_time','net_working_hours','total_break_hours','total_working_hours']

class CheckOutUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendence  
        fields = ['id','date','checkIn','checkOut']

#created By Ritesh
class AttendanceSerializer(serializers.ModelSerializer):
    total_office_hours = serializers.SerializerMethodField()
    total_working_hours = serializers.SerializerMethodField()
    total_present_days = serializers.SerializerMethodField()
    total_late_days = serializers.SerializerMethodField()
    total_half_days = serializers.SerializerMethodField()

    class Meta:
        model = DailyAttendanceReport
        fields = [
            'id','date', 'entry_time', 'exit_time',
            'total_working_hours', 'total_break_hours', 'net_working_hours',
            'total_office_hours', 'total_present_days', 'total_late_days', 'total_half_days'
        ]
   
        
    def validate(self, attrs):        
        attrs['employee_id'] = self.context.get('employee_id', self.context['request'].user.id)
        return super().validate(attrs)
    
    def get_default_dates(self):
        today = date.today()
        start_date = today.replace(day=1)
        end_date = today.replace(day=calendar.monthrange(today.year,today.month)[1])        
        return start_date,end_date
    
    def get_filtered_queryset(self):
        start_date = self.context.get('start_date')
        end_date = self.context.get('end_date')
        employee_id = self.context.get('employee_id', self.context['request'].user.id)

        if not start_date or not end_date:
            start_date,end_date = self.get_default_dates()

        queryset = DailyAttendanceReport.objects.filter(employee_id=employee_id,date__range=[start_date,end_date])
        return queryset

    def get_total_office_hours(self, obj):
        queryset = self.get_filtered_queryset()
        total_days = queryset.count()
        return total_days * 9

    def get_total_working_hours(self, obj):
        queryset = self.get_filtered_queryset()       
        total_working_seconds = queryset.aggregate(
            total=Sum(ExpressionWrapper(F('net_working_hours'), output_field=DurationField()))
        )['total']

        if total_working_seconds:
            total_working_hours = total_working_seconds.total_seconds() / 3600
            return total_working_hours
        return 0

    def get_total_present_days(self, obj):
        queryset = self.get_filtered_queryset()

        total_present_days = queryset.aggregate(total_days=Count('id'))['total_days']

        return total_present_days or 0

    def get_total_late_days(self, obj):
        queryset = self.get_filtered_queryset()

        total_late_days = queryset.filter(
            entry_time__gt=datetime.combine(date.today(), time(10, 0))
        ).aggregate(total_days=Count('id'))['total_days']

        return total_late_days or 0

    def get_total_half_days(self, obj):
        queryset = self.get_filtered_queryset()

        half_days_records = queryset.annotate(
            working_hours=ExpressionWrapper(
                F('exit_time') - F('entry_time'),
                output_field=DurationField()
            )
        ).filter(
            working_hours__lte=timedelta(hours=5)
        ).count()

        return half_days_records or 0   
   
#created By Ritesh

    
#created By Ritesh
class EmployeeRelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyRelations
        fields = ['id', 'designation', 'department', 'batch', 'joining_date', 'probation_end_date', 'work_duration', 'is_deleted']
    
    def validate(self, attrs):      
        employee_id = self.context.get('employeeId')
        
        if not employee_id:
            raise serializers.ValidationError({"error": "Can't get the employeeId"})        
              
        attrs['employee_id_id'] = employee_id
        return super().validate(attrs)

#created By Ritesh    
class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocuments
        fields = ['id','pan_card','aadhar_card','pan_image','aadhar_image']       

    def validate(self, attrs):
        employee_id = self.context.get('employeeId')   
        if not employee_id:
            raise serializers.ValidationError({"error": "Can't get the employeeId"})     
        
        attrs['employee_id_id'] = employee_id
        return super().validate(attrs) 

#created By Ritesh   
class DocumentsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocuments
        fields = ['id','pan_card','aadhar_card','pan_image','aadhar_image'] 

#created By Ritesh
class EmployeeProfileSerializer(serializers.ModelSerializer):   
    relations = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()
   
    class Meta:
        model = Employee
        fields = ['first_name','last_name','email','dob','bio','address','phone_number','gender','profile','relations','documents']

    def get_relations(self,obj):
        relations = CompanyRelations.objects.filter(employee_id = obj.id,).values("designation","department","batch","joining_date","probation_end_date","work_duration")        
        return relations
    
    def get_documents(self,obj):
        documents = EmployeeDocuments.objects.filter(employee_id = obj.id).values()
        return documents


    

