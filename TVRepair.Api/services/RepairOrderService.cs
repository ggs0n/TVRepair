using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using TVRepair.Api.data;
using TVRepair.Api.model;
using TVRepair.Api.Enums;

namespace TVRepair.Api.services
{
    public class RepairOrderService : IRepairOrderService
    {
        private readonly TVRepairDBContext _context;

        public RepairOrderService(TVRepairDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<RepairOrder>> AddRepairOrderAsync(
            RepairOrder repairOrder)
        {
            repairOrder.Id = Guid.NewGuid();
            repairOrder.CreatedDate = DateTime.UtcNow;
            repairOrder.Status = RepairOrderStatus.OrderPlace;

            _context.RepairOrder.Add(repairOrder);
            _context.RepairOrderStatusHistory.Add(
            CreateStatusHistory(repairOrder.Id, repairOrder.Status));
            var response = await _context.SaveChangesAsync();

            if (response == 0)
            {
                return new ApiResponse<RepairOrder>(
                true,
                StatusCodes.Status409Conflict,
                "Failed",
                repairOrder
                );
            }

            return new ApiResponse<RepairOrder>(
            true,
            StatusCodes.Status200OK,
            "Success",
            repairOrder
            );
        }

        public async Task<ApiResponse<List<GetRepairOrderResponse>>> GetRepairOrdersAsync(
            string userName)
        {
            var repairorder = await _context.Database
                .SqlQuery<GetRepairOrderResponse>(
                    $"EXEC dbo.GetRepairOrderTechnician @UserName={userName}")
                .ToListAsync();
            
            if(repairorder.Count == 0 || repairorder == null)
            {
                return new ApiResponse<List<GetRepairOrderResponse>>(
                true,
                StatusCodes.Status200OK,
                "Success"
                );
            }

            return new ApiResponse<List<GetRepairOrderResponse>>(
            true,
            StatusCodes.Status200OK,
            "Repair orders retrieved successfully.",
            repairorder
            );           
        }

        public async Task<List<RepairOrder>> GetRepairOrdersForTechnicianAsync(
            string area,
            string technicianId)
        {
            return await _context.RepairOrder
                .Where(order =>
                    (order.Area == area && order.Status == "OrderPlace") ||
                    order.TechnicianId == technicianId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ApiResponse<RepairOrder>> AcceptRepairOrderAsync(
            Guid repairOrderId,
            string technicianId)
            
        {
            var repairOrder = await _context.RepairOrder
                .FirstOrDefaultAsync(order => order.Id == repairOrderId);

            if (repairOrder == null)
            {
                return new ApiResponse<RepairOrder>(
                false,
                StatusCodes.Status404NotFound,
                "Repair order was not found."
                );
            }

            if (repairOrder.Status == RepairOrderStatus.OrderPlace)
            {
                repairOrder.Status = RepairOrderStatus.Accepted;
                repairOrder.TechnicianId = technicianId;
                _context.RepairOrderStatusHistory.Add(
                CreateStatusHistory(repairOrder.Id, repairOrder.Status));
                await _context.SaveChangesAsync();

                return new ApiResponse<RepairOrder>(
                false,
                StatusCodes.Status200OK,
                "Success",
                repairOrder
                );
            }
            else if (repairOrder.Status == RepairOrderStatus.Accepted)
            {
                return new ApiResponse<RepairOrder>(
                false,
                StatusCodes.Status409Conflict,
                "Technician already accepted",
                repairOrder
                );
            }

            return new ApiResponse<RepairOrder>(
                true,
                StatusCodes.Status200OK,
                "Order accepted successfully.",
                repairOrder
            );
        }

        public async Task<RepairOrder?> UpdateJobAsync(
            UpdateJobRequest request)
        {
            var repairOrder = await _context.RepairOrder
                .FirstOrDefaultAsync(
                    order => order.Id == request.RepairOrderId);

            if (repairOrder == null)
            {
                return null;
            }

            repairOrder.Status = request.Status;
            repairOrder.OrderNotes = request.RepairNotes;

            _context.RepairOrderStatusHistory.Add(
                CreateStatusHistory(repairOrder.Id, repairOrder.Status));

            await _context.SaveChangesAsync();

            return repairOrder;
        }

        public async Task<bool> SubmitQuotationAsync(
            SubmitQuotationRequest request)
        {
            var quotationExists = await _context.Quotation
                .AnyAsync(
                    quotation =>
                        quotation.RepairOrderId == request.RepairOrderId);

            if (quotationExists)
            {
                return false;
            }

            var repairOrder = await _context.RepairOrder
                .FirstOrDefaultAsync(
                    order => order.Id == request.RepairOrderId);

            if (repairOrder == null)
            {
                return false;
            }

            var quotation = new Quotation
            {
                RepairOrderId = request.RepairOrderId,
                QuotationDesc = request.QuotationDesc,
                Amount = request.Amount,
                CustomerId = request.CustomerId,
                TechnicianId = request.TechnicianId
            };

            _context.Quotation.Add(quotation);

            repairOrder.Status = RepairOrderStatus.Quotation;
            _context.RepairOrderStatusHistory.Add(
                CreateStatusHistory(repairOrder.Id, repairOrder.Status));

            await _context.SaveChangesAsync();

            return true;
        }

        private static RepairOrderStatusHistory CreateStatusHistory(
            Guid repairOrderId,
            string status)
        {
            return new RepairOrderStatusHistory
            {
                RepairOrderID = repairOrderId,
                Status = status,
                UpdatedDate = DateTime.UtcNow
            };
        }
    }
}
