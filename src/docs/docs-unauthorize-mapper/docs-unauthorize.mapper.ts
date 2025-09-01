// import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
// import { DiscoveryService, Reflector } from '@nestjs/core';
// import { IS_PUB}

// @Injectable()
// export class DocsUnauthorizeMapper implements OnApplicationBootstrap {
//   constructor(
//     private readonly discoveryService: DiscoveryService,
//     private readonly reflector: Reflector,
//   ) {}
//   onApplicationBootstrap() {
//     const controllers = this.discoveryService.getControllers();
//     controllers.forEach((wrapper) => {
//       const { instance } = wrapper;
//       const prototype = Object.getPrototypeOf(instance);

//       const isControllerPublic = this.reflector.get<boolean>(
//         IS_PUBLIC_KEY,
//         instance.constructor,
//       );

//       if (isControllerPublic) return;
//     });
//   }
// }
