import { User, AuthToken } from "tweeter-shared";
import { Buffer } from "buffer";
import { arugments, AuthenticatePresenter, AuthenticateView } from "./AuthenticatePresenter";

export interface UserRegisterView extends AuthenticateView {
    setImageUrl: React.Dispatch<React.SetStateAction<string>>,
    setImageFileExtension:  React.Dispatch<React.SetStateAction<string>>,
}

export class UserRegisterPresenter extends AuthenticatePresenter<UserRegisterView> {
    private _imageBytes: Uint8Array = new Uint8Array(); // Potiential source for bug. I pulled this from the component. check on this when you get to milestone 4A

    public constructor(view: UserRegisterView) {
        super(view)
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
      const args = {
        firstName,
        lastName,
        imageBytes: this._imageBytes,
        imageFileExtension
      }
      this.doAuthenticate(alias, password, rememberMe, "/", args)
    }

    public async authenticate(alias: string, password: string, args: arugments): Promise<[User, AuthToken]> {
      return await this.service.register(args.firstName!, args.lastName!, alias, password, args.imageBytes!, args.imageFileExtention!)
    }

    public navigateTo(destination: string | undefined): void {
      this.view.navigate(destination!)
    }

    public getAuthenticationType(): string {
      return 'register user'
    }
}