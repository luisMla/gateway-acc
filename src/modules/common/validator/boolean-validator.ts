import { registerDecorator, ValidationOptions } from 'class-validator';

export function BooleanTrue(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'booleanTrue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: any) {
          return true === value;
        },
        defaultMessage() {
          return '$property must match $constraint1';
        },
      },
    });
  };
}
