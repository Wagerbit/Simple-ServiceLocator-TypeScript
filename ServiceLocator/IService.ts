import ServiceLocator from "./ServiceLocator";

export default interface IService {
    serviceMember(): void; //This void method is for check the interface on ServiceLocator.ts. Implement it and leave it empty
    Initialize(services : ServiceLocator) : void;
    Dispose() : void;
}
