import Link from "next/link";
import { MdLocationOn } from "react-icons/md";

interface Listing {
  _id: string;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  address: string;
  regularPrice: number;
  offer: number;
  discountPrice: number;
  type: string;
  bathrooms: number;
  bedrooms: number;
}

const ListingItem = (props: {listing:Listing}) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      {/* <h2>ListingItem</h2> */}
      <Link href={`/listing/${props.listing._id}`}>
        <img
          src={props.listing.imageUrls[0]}
          alt="listing-cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-x-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {props.listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 w-full truncate">
              {props.listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {props.listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            $
            {props.listing.offer
              ? props.listing.discountPrice.toLocaleString()
              : props.listing.regularPrice.toLocaleString()}
            {props.listing.type === "rent" && "/month"}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {props.listing.bedrooms > 1
                ? `${props.listing.bedrooms} beds`
                : `${props.listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {props.listing.bathrooms > 1
                ? `${props.listing.bathrooms} baths`
                : `${props.listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
