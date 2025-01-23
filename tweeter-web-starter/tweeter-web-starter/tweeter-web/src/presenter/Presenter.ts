export interface View {
    displayErrorMessage: (message: string) => void
}

export interface DisplayView extends View {
    clearLastInfoMessage: () => void,
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void,
}

export interface DisplayLoadingView extends DisplayView {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export class Presenter<V extends View> {
    private _view: V

    protected constructor(view: V) {
        this._view = view
    }

    protected get view(): V {
        return this._view
    }

    protected async doFailureReportingOperation (operation: () => Promise<void>, operationDescription: string): Promise<void> {
            try {
                await operation()
            } catch (error) {
                this.view.displayErrorMessage(
                   `Failed to ${operationDescription} because of exception: ${error}`
                );
            }
        };
}