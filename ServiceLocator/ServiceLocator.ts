import IService from "./IService";

export default class ServiceLocator {
    private static _instance : ServiceLocator;
    private services : { [serviceId: string]: object } = {};
    private requests : { [serviceId : string] : Array<(service : object) => void>} = {};

    public static get Instance() : ServiceLocator{
        if(this._instance == null)
            this._instance = new ServiceLocator();
        return this._instance;
    }

    public RegisterInstance(service : object){
        var type = service.constructor.name;
        if(!(type in this.services)){
            this.services[type] = service;
            this.ResolvePendingRequest(service);
        }
        else
            console.error("Service " + type + " is already register");
    }

    public Register<T extends IService>(service : {new() : T; }) : T{
        var type = service.name;
        if(!(type in this.services)){
            var serviceInstance = new service();
            this.services[type] = serviceInstance;
            serviceInstance.Initialize(this);
            this.ResolvePendingRequest(service);
            return serviceInstance;
        }
        else
            console.error("Service " + type + " is already register");
    }

    public GetService<T extends object>(service : T) : T {
        var type =  service.name;
        var object = this.services[type];
        if(object != null)
            return object as T;
        else
            return null;
    }

    public WaitForService<T extends object>(service : T, callback : (service : T) => void){
        var type =  service.name;
        var object = this.services[type];
        if(object != null){
            callback(service as T);
        }
        else{
            this.RegisterRequest(type, callback);
        }
    }

    public DisposeService(service : IService){
        service.Dispose();
        var type = service.constructor.name;
        if(type in this.services)
            delete this.services[type];
    }

    public DisposeAllServices(){
        for(var id in this.services){
            if(this.IsInstanceOfService(this.services[id])){
                (this.services[id] as IService).Dispose();
                delete this.services[id];
            }
            else{
                console.error("Is not IService");
            }
        }
    }

    private ResolvePendingRequest<T extends object>(service : T){
        var type =  service.name;
        if(!(type in this.requests))
            return null;
        for(var i = 0; i < this.requests[type].length; i++){
            this.requests[type][i](service as T);
        }
        this.requests[type] = null;
    }

    private RegisterRequest(type : string, callback : (service : object) => void){
        if(type in this.requests){
            this.requests[type].push(callback);
        }
        else{
            this.requests[type] = new Array<(service : object) => void>(callback);
        }
    }

    private IsInstanceOfService(service: any): service is IService {
        var iServiceInterface = service as IService;
        return 'serviceMember' in service;
    }
}
