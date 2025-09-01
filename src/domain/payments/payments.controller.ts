import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdDto } from '../../common/dtos/id.dto';
import { Payment } from './entities/payment.entity'; // Assuming you have a Payment entity
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':id')
  @ApiOperation({ summary: 'Pay for an order by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the order to pay' })
  @ApiResponse({
    status: 201,
    description: 'Payment processed successfully',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  payOrder(@Param() { id }: IdDto) {
    return this.paymentsService.payOrder(id);
  }
}
