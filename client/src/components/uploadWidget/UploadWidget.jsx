import { useEffect, useRef } from 'react';

const UploadWidget = ({ uwConfig, setState }) => {
  const uploadWidgetRef = useRef(null);
  const uploadButtonRef = useRef(null);

  useEffect(() => {
    // Ensure Cloudinary script is loaded
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      script.onload = initializeUploadWidget;
      document.body.appendChild(script);
    } else {
      initializeUploadWidget();
    }

    function initializeUploadWidget() {
      if (window.cloudinary && uploadButtonRef.current) {
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            if (!error && result && result.event === 'success') {
              console.log('Upload successful:', result.info);
              // setAvatar(result.info.secure_url);
              setState(prev=>[...prev , result.info.secure_url])
            }
          }
        );
      }
    }

    const handleUploadClick = () => {
      if (uploadWidgetRef.current) {
        uploadWidgetRef.current.open();
      }
    };

    const buttonElement = uploadButtonRef.current;
    if (buttonElement) {
      buttonElement.addEventListener('click', handleUploadClick);
    }

    // Cleanup function
    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener('click', handleUploadClick);
      }
    };
  }, [uwConfig]);

  return (
    <button ref={uploadButtonRef} className="cloudinary-button">
      Upload
    </button>
  );
};

export default UploadWidget;
