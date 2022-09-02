import { useCallback, useState } from "react"
import "./Toast.css"

interface toastProperties {
    data: {
      title : string,
      description : string,
      backgroundColor:string
    } |undefined;
    close: () => void;
}

export const Toast = ({data, close}: toastProperties) => {

    const deleteToast = useCallback(() => {
        close();
    }, [data, close]);
    // pending, success, error, default
    return (
        <div>
        {data && 
            <div className="container buttom-right">
                <div
                    className="notification toast buttom-right"
                    style={{ backgroundColor: data?.backgroundColor }}
                >
                    <button onClick={() => deleteToast()}>X</button>
                    <div>
                        <p className="title">{data?.title}</p>
                        <p className="description">{data?.description}</p>
                    </div>
                </div>
            </div>
        }
        </div>
    );
}