import React from 'react';
import { generateUploadButton } from '@uploadthing/react';


export const UploadButton = generateUploadButton({
  url: 'http://localhost:5000/api/uploadthing',
});

