// import { ValidationPipe } from './validation.pipe';
// import { BadRequestException } from '@nestjs/common';

// describe('ValidationPipe', () => {
//   let validationPipe: ValidationPipe<any>;

//   beforeEach(() => {
//     validationPipe = new ValidationPipe();
//   });

//   it('should be defined', () => {
//     expect(validationPipe).toBeDefined();
//   });

//   it('should transform the value if validation passes', async () => {
//     const value = { name: 'John', age: 30 };
//     const metadata = { metatype: Object } as any;

//     const transformedValue = await validationPipe.transform(value, metadata);

//     expect(transformedValue).toEqual(value);
//   });

//   it('should throw BadRequestException if validation fails', async () => {
//     const value = { name: 'John', age: '30' }; // age should be a number, but it's a string
//     const metadata = { metatype: Object } as any;

//     await expect(validationPipe.transform(value, metadata)).rejects.toThrow(
//       BadRequestException,
//     );
//   });
// });
