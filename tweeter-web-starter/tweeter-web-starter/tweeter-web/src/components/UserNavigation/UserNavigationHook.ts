import { AuthToken, User, FakeData } from "tweeter-shared";
import useUserInfo from "../userInfo/UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";

const useUserNavigation = () => {

    const { setDisplayedUser, currentUser, authToken } = useUserInfo()
    const { displayErrorMessage } = useToastListener();

    const getUser = async (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> => {
        return FakeData.instance.findUserByAlias(alias);
    }

    const extractAlias = (value: string): string => {
        const index = value.indexOf('@');
        return value.substring(index);
    }

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
    
        try {
          const alias = extractAlias(event.target.toString());
    
          const user = await getUser(authToken!, alias);
    
          if (!!user) {
            if (currentUser!.equals(user)) {
              setDisplayedUser(currentUser!);
            } else {
              setDisplayedUser(user);
            }
          }
        } catch (error) {
          displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    };

    return { getUser, extractAlias, navigateToUser }
}

export default useUserNavigation