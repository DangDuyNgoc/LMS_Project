import Loader from "@/components/loader/loader";
import useUser from "@/hook/auth/useUser";
import { Redirect } from "expo-router";

export default function TabsIndex() {
  const {loading, user} = useUser();

  return (
    <>
      {
        loading ? (
          
          <Loader />
        ): (
          <Redirect href={!user ? "/(routes)/onboarding" : "/(tabs)"} />
        )
      }
    </>
  );
}
