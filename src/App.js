import React, { useContext, useEffect, useState } from "react";
import Routes from "./routes/routes";
import PsContextProvider from "./context/PsContextProvider";

import toast, { Toaster, ToastBar } from "react-hot-toast";

import apiRequest from "./utils/apiRequest";
import PsContext from "./context";

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

    if (isMobileView()) {
      document.getElementsByTagName("body")[0].style.background = "#fbfbfb";
    }
  }, []);

  const isMobileView = () => (windowWidth < breakpoint ? true : false);

  const toasterOptions = () => {
    return {
      //duration: 100000,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    };
    /*return isMobileView()
      ? {}
      : {
          //duration: 100000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        };*/
  };

  return (
    <PsContextProvider>
      {/*<Toaster 
			toastOptions={{
				style: {
				  borderRadius: '10px',
				  background: '#333',
				  color: '#fff',
				},
			}}
		/>*/}
      <Toaster toastOptions={toasterOptions()}>
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                      background: "transparent",
                      border: "0px",
                      color: "#918f8f",
                    }}
                  >
                    x
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      <Routes />
      <iframe
        name="print_frame"
        id="print_frame"
        width="0"
        height="0"
        frameBorder="0"
        src="about:blank"
      ></iframe>
    </PsContextProvider>
  );
}

export default App;
