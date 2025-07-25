// "use client";

import UpdateListingComponent from "@/components/update-listing/UpdateListing";

// import { useUser } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";

// export default function UpdateListing() {
//   const { isSignedIn, user, isLoaded } = useUser();
//   // const [files,setFiles] = useState([]);

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [securedUrls, setSecuredUrls] = useState<string[]>([]);

//   const [selectedImages, setSelectedImages] = useState<string[]>([]); //img frm my pc
//   const [images, setImages] = useState<File[]>([]); //upload 2 cloudinary

//   const [progress, setProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = e.target.files;

//     if (!selectedFiles) {
//       return console.log("Error:no image selected");
//     }

//     const selectedFilesArray = Array.from(selectedFiles);
//     const imagesArray = selectedFilesArray.map((file: File) => {
//       return URL.createObjectURL(file);
//     });

//     setImages((prevImages) => prevImages.concat(selectedFilesArray));
//     setSelectedImages((prevImages) => prevImages.concat(imagesArray));
//   };

//   const removeImage = (image: string) => {
//     const imageIndex = selectedImages.indexOf(image);
//     setSelectedImages(selectedImages.filter((img) => img !== image));

//     setImages((prev) => prev.filter((_, index) => index !== imageIndex));
//     URL.revokeObjectURL(image);
//   };

//   const uploadImage = async()=>{
//     if(!images.length){
//       console.log("select image");
//       return
//     };
//        console.log("images:", images);

//        setUploading(true);

//        const imageUrls: string[] = [];

//        try{
//         for(let i=0; i<images.length; i++){
//           const file = images[i];
//           console.log("x_file:",file);

//           const formData = new FormData();
//           console.log("formData:", formData);

//           const x_file2 = formData.append("file",file);
//           console.log("x_file2:", x_file2);

//           const response = await fetch("/api/upload",{
//             method:"POST",
//             body:formData
//           });

//           const imgData = await response.json();
//           console.log("imgData:", imgData);

//           if(imgData?.results?.secure_url){
//             imageUrls.push(imgData?.result?.secure_url);
//             setProgress(imageUrls.length);
//             console.log("we got it here...")
//           };


//         }
//        }catch(error){

//        }
//   }

//   const pathName = usePathname();
//   const listingId = pathName.split("/").pop();

//   const [formData, setFormData] = useState({
//     imageUrls: [],
//     name: "",
//     description: "",
//     address: "",
//     type: "rent",
//     bedrooms: 1,
//     bathrooms: 1,
//     regularPrice: 50,
//     discountPrice: 0,
//     offer: false,
//     parking: false,
//     furnished: false,
//   });

//   useEffect(() => {
//     const fetchListing = async () => {
//       const response = await fetch("/api/listing/get", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ listingId }),
//       });
//       if (!response.ok) {
//         throw new Error("something went wrong");
//       }

//       const responseData = await response.json();
//       console.log("responseData:", responseData);
//       setFormData(responseData);
//     };
//     fetchListing();
//   }, []);
// }

const UpdateListing = () => {
  return ( 
    <div>
        <UpdateListingComponent />
    </div>
   );
}
 
export default UpdateListing;
