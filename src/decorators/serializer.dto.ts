import { UseInterceptors } from '@nestjs/common';
import { SerializerInterceptor } from 'src/interceptors/serializer.interceptor';

interface ClassConstructor {
  new (...args: any[]): any;
}

export function Serializer(dto: ClassConstructor) {
  return UseInterceptors(new SerializerInterceptor(dto));
}
