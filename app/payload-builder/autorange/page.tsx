import { Suspense } from "react";
import { Skeleton } from "@chakra-ui/skeleton";
import { fetchAddressBook } from "@/lib/data/balancer/addressBook";
import ReClammModule from "@/components/ReClammModule";

export default async function ReClammPage() {
  //Fetch address book data
  const addressBook = await fetchAddressBook();

  return (
    <Suspense fallback={<Skeleton w="full" h="500px" />}>
      <ReClammModule addressBook={addressBook} />
    </Suspense>
  );
}
