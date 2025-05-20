import { Injectable, PipeTransform } from '@nestjs/common';
import { parse } from 'qs';

@Injectable()
export class ParseNestedObjectPipe implements PipeTransform {
  transform(value: unknown) {
    if (typeof value === 'string') {
      return parse(value);
    } else if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      value !== null
    ) {
      const result = parse(
        new URLSearchParams(value as Record<string, string>).toString(),
      );
      return result;
    }
    return value;
  }
}
