import { AuthToken, User, FakeData } from "tweeter-shared";
import useUserInfo from "../userInfo/UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";
import { UserNavigationClass, UserNavigationView } from "../../presenter/UserNavigationPresenter";
import { useState } from "react";

const useUserNavigation = () => {

    const { setDisplayedUser, currentUser, authToken } = useUserInfo()
    const { displayErrorMessage } = useToastListener();

    const listener: UserNavigationView = {
      setDisplayedUser: setDisplayedUser,
      displayErrorMessage: displayErrorMessage
    }

    const [presenter] = useState(new UserNavigationClass(listener))


    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        presenter.navigateToUser(event.target.toString(), authToken!, currentUser!)
    };

    return { navigateToUser }
}

export default useUserNavigation