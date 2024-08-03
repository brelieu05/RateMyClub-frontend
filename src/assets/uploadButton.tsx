import React from 'react';
import { generateUploadButton } from '@uploadthing/react';


export const UploadButton = generateUploadButton({
  url: 'https://ratemyclub-backend-production.up.railway.app/api/uploadthing',
});

