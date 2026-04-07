/* eslint-disable prefer-const */
import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { IPaginationProps } from "src/core/types";

@Injectable()
export class PaginationPipe implements PipeTransform<any, IPaginationProps> {
  transform(value: IPaginationProps): IPaginationProps {
    let { page, limit, query } = value;

    page = Number(page);
    limit = Number(limit);
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 10;
    if (limit > 100) {
      throw new BadRequestException("limit cannot be greater than 100");
    }

    if (isNaN(page)) {
      throw new BadRequestException("page must be a number");
    }

    if (isNaN(limit)) {
      throw new BadRequestException("limit must be a number");
    }

    return {
      page,
      limit,
      query,
    };
  }
}
