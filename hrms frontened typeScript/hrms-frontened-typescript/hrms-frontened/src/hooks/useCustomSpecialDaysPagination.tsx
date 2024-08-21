import React from 'react'
import { Button } from 'react-bootstrap';
interface CustomPaginationProp{
  currentPage:number
  totalPages :number
  onPageChange : (page : number)=>void
}
const CustomSpecialDaysPagination : React.FC<CustomPaginationProp> = ({ currentPage, totalPages, onPageChange }) => {   
    
      const handlePrevious = () => {
        if (currentPage > 1) {
          onPageChange(currentPage - 1);
        }
      };
    
      const handleNext = () => {
        if (currentPage < totalPages) {
          onPageChange(currentPage + 1);
        }
      };    
    
      return (
        <div className="customPagination">          
          <Button className="btn-sm paginationButton" onClick={handlePrevious} disabled={currentPage === 1} >
            <span aria-hidden="true">&lsaquo;</span>
          </Button>          
          <Button className="btn-sm paginationButton" onClick={handleNext} disabled={currentPage === totalPages} >
            <span aria-hidden="true">&rsaquo;</span>
          </Button>        
        </div>
      );
}

export default CustomSpecialDaysPagination