import { useCallback } from "react";
import { useHttpsApiResponse } from "../contexts/httpsResponseContext";

const userProfile = () => {
  const { get, post } = useHttpsApiResponse();
  const fetchUserProfile = useCallback(async () => {
    const response = await get("api/user/user-info/");
    return response.data;
  }, [get]);

  return { fetchUserProfile };
};
export default userProfile;
