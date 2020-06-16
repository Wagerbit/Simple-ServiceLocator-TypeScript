export default class ServiceLocator {
    private static _instance : ServiceLocator;
    private services : { [userId: string]: object } = {};

    public static get Instance() : ServiceLocator{
        if(this._instance == null)
            this._instance = new ServiceLocator();
    
        return this._instance;
    }

    public RegisterService(service : object){
        var type = service.constructor.name;
        if(!(type in this.services))
            this.services[type] = service;
        else
            console.error("Service " + type + " is already register");
    }

    public GetService<T extends object>(type : T) : T {
        var string =  type.name;
        var object = this.services[string];
        if(object != null)
            return object as T;
        else
            return null;
    }
}
