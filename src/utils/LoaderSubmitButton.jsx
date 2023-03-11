import React, { useEffect, useState } from "react";
import $ from "jquery";
import { Button, Spinner } from "react-bootstrap";

const LoaderSubmitButton = (props) => {
  const buttonText = () => props.text || "Submit";

  const buttonLoadingText = () => props.loadingText || "Wait...";

  const buttonSpinner = () =>
    props.loading && <Spinner animation="border" size="sm" className="me-2" />;

  return (
    <Button
      type="submit"
      variant={props.variant || "primary"}
      size={props.size || "sm"}
      disabled={props.loading}
      {...props}
    >
      {buttonSpinner()}
      {props.loading ? buttonLoadingText() : buttonText()}
    </Button>
  );
};

export default LoaderSubmitButton;
