import { Body, Controller, Get, HttpStatus, Param, Post, ValidationPipe } from '@nestjs/common';
import { TroopsApplicationService } from '../../applications/TroopsApplicationService';
import { RestTroop } from './RestTroop';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RestTroopToCreate } from './RestTroopToCreate';
import { UUID } from 'node:crypto';
import { UserId } from '../../domain/UserId';

@ApiTags('Troops')
@Controller('api/v1/users/')
export class RestTroopsResource {
  constructor(
    private readonly troopsApplicationService: TroopsApplicationService,
  ) {}

  @Post(':userId/troops')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return a new troop of the user',
    type: RestTroop,
  })
  async createTroop(
    @Param('userId') userId: UUID,
    @Body(new ValidationPipe({ transform: true }))
    restTroopToCreate: RestTroopToCreate,
  ): Promise<RestTroop> {
    const troop = await this.troopsApplicationService.createTroop(
      restTroopToCreate.toDomain(new UserId(userId)),
    );
    return RestTroop.from(troop);
  }

  @Get(':userId/troops')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the troops of a user',
    type: RestTroop,
    isArray: true,
  })
  async getTroops(@Param('userId') userId: UUID): Promise<RestTroop[]> {
    const troops = await this.troopsApplicationService.getTroopsByUser(
      new UserId(userId),
    );
    return troops.map(RestTroop.from);
  }
}
