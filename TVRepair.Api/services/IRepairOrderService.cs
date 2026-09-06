using TVRepair.Api.data;
using TVRepair.Api.model;

namespace TVRepair.Api.services
{
    public interface IRepairOrderService
    {
        Task<RepairOrder> AddRepairOrderAsync(RepairOrder repairOrder);

        Task<List<GetRepairOrderResponse>> GetRepairOrdersAsync(string userName);

        Task<List<RepairOrder>> GetRepairOrdersForTechnicianAsync(
            string area,
            string technicianId);

        Task<RepairOrder?> AcceptRepairOrderAsync(
            Guid repairOrderId,
            string technicianId);

        Task<RepairOrder?> UpdateJobAsync(UpdateJobRequest request);

        Task<bool> SubmitQuotationAsync(SubmitQuotationRequest request);
    }
}
