using TVRepair.Api.data;
using TVRepair.Api.model;

namespace TVRepair.Api.services
{
    public interface IRepairOrderService
    {
        Task<ApiResponse<RepairOrder>> AddRepairOrderAsync(RepairOrder repairOrder);

        Task<ApiResponse<List<GetRepairOrderResponse>>> GetRepairOrdersAsync(string userName);

        Task<List<RepairOrder>> GetRepairOrdersForTechnicianAsync(
            string area,
            string technicianId);

        Task<ApiResponse<RepairOrder?>> AcceptRepairOrderAsync(
            Guid repairOrderId,
            string technicianId);

        Task<RepairOrder?> UpdateJobAsync(UpdateJobRequest request);

        Task<bool> SubmitQuotationAsync(SubmitQuotationRequest request);
    }
}
