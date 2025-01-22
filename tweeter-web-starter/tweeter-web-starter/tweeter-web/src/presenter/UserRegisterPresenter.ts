import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/userService";
import { Buffer } from "buffer";

export interface UserRegisterView {
    displayErrorMessage: (message: string) => void,
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void,
    navigate: NavigateFunction,
    setImageUrl: React.Dispatch<React.SetStateAction<string>>,
    setImageFileExtension:  React.Dispatch<React.SetStateAction<string>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export class UserRegisterPresenter {
    private userService: UserService;
    private view: UserRegisterView
    private _imageBytes: Uint8Array = new Uint8Array();

    public constructor(view: UserRegisterView) {
        this.view = view
        this.userService = new UserService
    }

    public getFileExtension = (file: File): string | undefined => {
        return file.name.split(".").pop();
    };

    public handleImageFile (file: File | undefined) {
        if (file) {
          this.view.setImageUrl(URL.createObjectURL(file));
    
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const imageStringBase64 = event.target?.result as string;
    
            // Remove unnecessary file metadata from the start of the string.
            const imageStringBase64BufferContents =
              imageStringBase64.split("base64,")[1];
    
            const bytes: Uint8Array = Buffer.from(
              imageStringBase64BufferContents,
              "base64"
            );
    
            this._imageBytes = bytes;
          };
          reader.readAsDataURL(file);
    
          // Set image file extension (and move to a separate method)
          const fileExtension = this.getFileExtension(file);
          if (fileExtension) {
            this.view.setImageFileExtension(fileExtension);
          }
        } else {
          this.view.setImageUrl("");
          this._imageBytes = new Uint8Array();
        }
      };


    public async doRegister (firstName: string, lastName: string, alias: string, password: string, imageFileExtension: string, rememberMe: boolean) {
        try {
            this.view.setIsLoading(true)
      
            const [user, authToken] = await this.userService.register(
              firstName,
              lastName,
              alias,
              password,
              this._imageBytes,
              imageFileExtension
            );
      
            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigate("/");
          } catch (error) {
            this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
          } finally {
            this.view.setIsLoading(false)
          }
    }
}