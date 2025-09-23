import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import carDetails from './../Shared/carDetails.json'
import InputField from './components/InputField'
import DropdownField from './components/DropdownField'
import { Separator } from '@/components/ui/separator'
import features from './../Shared/features.json'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { db } from './../../configs'
import { CarImages, CarListing } from './../../configs/schema'
import TextAreaField from './components/TextAreaField'
import IconField from './components/IconField'
import UploadImages from './components/UploadImages'
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from 'sonner'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import moment from 'moment'
import { eq } from 'drizzle-orm'
import Service from '@/Shared/Service'

function AddListing() {
  const initialFormData = carDetails.carDetails.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [featuresData, setFeaturesData] = useState({});
  const [triggerUploadImages, setTriggerUploadImages] = useState();
  const [searchParams] = useSearchParams();
  const [loader, setLoader] = useState(false);
  const [carInfo, setCarInfo] = useState();
  const navigate = useNavigate();
  const { user } = useUser();

  const mode = searchParams.get('mode');
  const recordId = searchParams.get('id');

  useEffect(() => {
    if (mode === 'edit') {
      GetListingDetail();
    }
  }, []);
  useEffect(() => {
    console.log("triggerUploadImages state changed:", triggerUploadImages);
  }, [triggerUploadImages]);
  useEffect(() => {
    if (triggerUploadImages) {
      const timer = setTimeout(() => {
        setTriggerUploadImages(triggerUploadImages);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [triggerUploadImages]);


  /**
   * Used to get Car Listing Details from ID
   */
  const GetListingDetail = async () => {
    const result = await db.select().from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.id, recordId));

    const resp = Service.FormatResult(result)
    setCarInfo(resp[0])
    setFormData(resp[0] || initialFormData);
    setFeaturesData(resp[0]?.features || {});
  }

  /**
   * Use to capture user input from form
   */
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  /**
   * Used to save selected Feature List
   */
  const handleFeatureChange = (name, value) => {
    setFeaturesData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

//   const onSubmit = async (e) => {
//   setLoader(true);
//   e.preventDefault();

//   console.log("Clerk user object:", user);
//   console.log("Submitting formData:", formData);
//   console.log("Features:", featuresData);

//   toast('Please Wait...');

//   if (!user) {
//     toast.error("Please sign in before submitting.");
//     setLoader(false);
//     return;
//   }

//   // Safe fallbacks for Clerk user
//   const safeUserName =
//     user.fullName ||
//     user.username ||
//     user.primaryEmailAddress?.emailAddress ||
//     "CarMitra User";

//   const safeUserImage =
//     user.imageUrl ||
//     "https://cdn-icons-png.flaticon.com/512/743/743007.png";

//   // sanitize numeric fields (remove commas)
//   const cleanData = {
//     ...formData,
//     sellingPrice: formData?.sellingPrice ? formData.sellingPrice.replace(/,/g, "") : formData?.sellingPrice,
//     originalPrice: formData?.originalPrice ? formData.originalPrice.replace(/,/g, "") : formData?.originalPrice,
//   };
  
//     if (mode === 'edit') {
//     try {
//       const result = await db
//         .update(CarListing)
//         .set({
//           ...cleanData,
//           // sellingPrice: formData.sellingPrice?.replace(/\D/g, ""),  // removes ₹ and commas
//           // originalPrice: formData.originalPrice?.replace(/\D/g, ""),
//           features: featuresData,
//           createdBy: user.primaryEmailAddress?.emailAddress || "unknown",
//           userName: safeUserName,       // fallback applied
//           userImageUrl: safeUserImage,  // fallback applied
//           postedOn: moment().format('DD/MM/yyyy')
//         })
//         .where(eq(CarListing.id, recordId))
//         .returning({ id: CarListing.id });

//       console.log("Update result:", result);
//       navigate('/profile');
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error("Failed to update listing.");
//     }
//     setLoader(false);
//   } else {
//     try {
//       const result = await db
//         .insert(CarListing)
//         .values({
//           ...cleanData,
//           // sellingPrice: formData.sellingPrice?.replace(/\D/g, ""),  // removes₹and,
//           // originalPrice: formData.originalPrice?.replace(/\D/g, ""),
//           features: featuresData,
//           createdBy: user.primaryEmailAddress?.emailAddress || "unknown",
//           userName: safeUserName,       // fallback
//           userImageUrl: safeUserImage,  // fallback
//           postedOn: moment().format('DD/MM/yyyy')
//         })
//         .returning({ id: CarListing.id });

//       if (result) {
//         console.log("Insert result:", result);
//         setTriggerUploadImages(result[0]?.id);
//         console.log("TriggerUploadImages is now:", result[0]?.id);
//         // Reset triggerUploadImages after 1 second for re-trigger capability
//         setTimeout(() => setTriggerUploadImages(undefined), 1000);
//       }
//     } catch (e) {
//       console.error("Insert error:", e);
//       toast('Please fill all required fields');
//     } finally {
//       setLoader(false);
//     }
//   }
// };
  const onSubmit = async (e) => {
  setLoader(true);
  e.preventDefault();

  console.log("Clerk user object:", user);
  console.log("Submitting formData:", formData);
  console.log("Features:", featuresData);

  toast('Please Wait...');

  if (!user) {
    toast.error("Please sign in before submitting.");
    setLoader(false);
    return;
  }

  const safeUserName =
    user.fullName ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "CarMitra User";

  const safeUserImage =
    user.imageUrl ||
    "https://cdn-icons-png.flaticon.com/512/743/743007.png";

  const cleanData = {
    ...formData,
    sellingPrice: formData?.sellingPrice ? formData.sellingPrice.replace(/,/g, "") : formData?.sellingPrice,
    originalPrice: formData?.originalPrice ? formData.originalPrice.replace(/,/g, "") : formData?.originalPrice,
  };

  if (mode === 'edit') {
    try {
      const result = await db
        .update(CarListing)
        .set({
          ...cleanData,
          features: featuresData,
          createdBy: user.primaryEmailAddress?.emailAddress || "unknown",
          userName: safeUserName,
          userImageUrl: safeUserImage,
          postedOn: moment().format('DD/MM/yyyy')
        })
        .where(eq(CarListing.id, recordId))
        .returning({ id: CarListing.id });

      console.log("Update result:", result);
      navigate('/profile');
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update listing.");
    }
    setLoader(false);
  } else {
    try {
      const result = await db
        .insert(CarListing)
        .values({
          ...cleanData,
          features: featuresData,
          createdBy: user.primaryEmailAddress?.emailAddress || "unknown",
          userName: safeUserName,
          userImageUrl: safeUserImage,
          postedOn: moment().format('DD/MM/yyyy')
        })
        .returning({ id: CarListing.id });

      console.log("Insert result:", result);
      if (result && result.length > 0) {
        console.log("triggerUploadImages will be set to:", result[0]?.id);
        setTriggerUploadImages(result[0]?.id);
        setTimeout(() => setTriggerUploadImages(undefined), 1000);
      } else {
        console.log("Insert result is empty or undefined, upload trigger will not set.");
      }
    } catch (e) {
      console.error("Insert error:", e);
      toast('Please fill all required fields');
    } finally {
      setLoader(false);
    }
  }
};


  return (
    <div>
      <Header />
      <div className='px-10 md:px-20 my-10'>
        <h2 className='font-bold text-4xl'>Add New Listing</h2>
        <form className='p-10 border rounded-xl mt-10'>
          {/* Car Details */}
          <div>
            <h2 className='font-medium text-xl mb-6'>Car Details</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {carDetails.carDetails.map((item, index) => (
                <div key={index}>
                  <label className='text-sm flex gap-2 items-center mb-1'>
                    <IconField icon={item?.icon} />
                    {item?.label} {item.required && <span className='text-red-500'>*</span>}
                  </label>
                  {item.fieldType === 'text' || item.fieldType === 'number'
                    ? <InputField item={item} handleInputChange={handleInputChange} formData={formData} />
                    : item.fieldType === 'dropdown'
                      ? <DropdownField item={item} handleInputChange={handleInputChange} formData={formData} />
                      : item.fieldType === 'textarea'
                        ? <TextAreaField item={item} handleInputChange={handleInputChange} formData={formData} />
                        : null}
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-6" />

          {/* Features List */}
          <div>
            <h2 className='font-medium text-xl my-6'>Features</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
              {features.features.map((item, index) => (
                <div key={index} className='flex gap-2 items-center'>
                  <Checkbox
                    onCheckedChange={(value) => handleFeatureChange(item.name, value)}
                    checked={featuresData?.[item.name] || false}
                  />
                  <h2>{item.label}</h2>
                </div>
              ))}
            </div>
          </div>

          {/* Car Images */}
          <Separator className="my-6" />
          {/* <UploadImages
            triggerUploadImages={triggerUploadImages}
            setTriggerUploadImages={setTriggerUploadImages}  // pass setter also
            carInfo={carInfo}
            mode={mode}
            setLoader={(v) => { setLoader(v); navigate('/profile') }}
          /> */}
          <UploadImages
            triggerUploadImages={3}
            setTriggerUploadImages={setTriggerUploadImages}
            carInfo={carInfo}
            mode={mode}
            setLoader={setLoader}
          />

          <div className='mt-10 flex justify-end'>
            <Button
              type="button"
              disabled={loader}
              onClick={(e) => onSubmit(e)}
            >
              {!loader ? 'Submit' : <BiLoaderAlt className='animate-spin text-lg' />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddListing