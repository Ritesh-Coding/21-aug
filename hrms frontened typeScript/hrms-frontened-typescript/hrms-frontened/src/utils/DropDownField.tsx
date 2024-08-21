// InputField.js
import React, {ChangeEvent, FocusEvent} from 'react';
import Form from 'react-bootstrap/Form';

interface DropDownInterface{
    label : string,
    type : string,
    name : string,
    value : string,
    onChange :(e: ChangeEvent<HTMLInputElement>) => void,
    onBlur :  (e: FocusEvent<HTMLInputElement>) => void,
    placeholder : string,
    isInvalid : boolean | undefined,
    error : boolean | undefined
}

const InputField : React.FC<DropDownInterface>= ({ label, type, name, value, onChange, onBlur, placeholder, isInvalid, error }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                isInvalid={isInvalid}
            />
            {isInvalid && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        </Form.Group>
    );
};

export default InputField;