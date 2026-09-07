using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TVRepair.Api.data;
using TVRepair.Api.model;
using TVRepair.Api.services;

namespace TVRepair.Api.apicontroller
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TVRepairController : ControllerBase
    {
        private readonly IRepairOrderService _repairOrderService;

        public TVRepairController(IRepairOrderService repairOrderService)
        {
            _repairOrderService = repairOrderService;
        }

        [HttpPost("AddRepairOrder")]
        public async Task<ActionResult> AddRepairOrder(
            [FromForm] RepairOrder request)
        {

            try {
            var result = await _repairOrderService.AddRepairOrderAsync(request);
            return StatusCode (
                result.ErrorCode,
                result
            );
            }

            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetRepairOrder")]
        public async Task<ActionResult<List<GetRepairOrderResponse>>>
            GetRepairOrder(string UserName)

        {
            if (string.IsNullOrWhiteSpace(UserName))
            {
                return BadRequest("User name is required.");
            }

            try {
            var result = await _repairOrderService.GetRepairOrdersAsync(UserName);

            return StatusCode (
                result.ErrorCode,
                result
            );
            }

            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetRepairOrderTechnician")]
        public async Task<ActionResult<List<RepairOrder>>>
            GetRepairOrderTechnician(string Area, string TechnicianID)
        {
            if (string.IsNullOrWhiteSpace(Area) ||
                string.IsNullOrWhiteSpace(TechnicianID))
            {
                return BadRequest(
                    "Area and technician ID are required.");
            }
            try {
            var result = await _repairOrderService
                .GetRepairOrdersForTechnicianAsync(Area, TechnicianID);

            return Ok(result);
            }

            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("AcceptRepairOrderTechnician")]
        public async Task<ActionResult> AcceptRepairOrderTechnician(
            Guid Id,
            string TechnicianId)
        {
            try {

            var result = await _repairOrderService
                .AcceptRepairOrderAsync(Id, TechnicianId);

            return StatusCode (
                result.ErrorCode,
                result
            );
            }

            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("MatchRepairOrderTechnician")]
        public ActionResult MatchRepairOrderTechnician()
        {
            return Ok();
        }

        [HttpPost("UpdateJob")]
        public async Task<ActionResult> UpdateJob(
            [FromForm] UpdateJobRequest request)
        {
            if (request.RepairOrderId == Guid.Empty)
            {
                return BadRequest("Repair order ID is required.");
            }

            try {
            var result =
                await _repairOrderService.UpdateJobAsync(request);

            if (result == null)
            {
                return NotFound("Repair order was not found.");
            }

            return Ok(result);
            }

            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("SubmitQuotation")]
        public async Task<ActionResult> SubmitQuotation(
            [FromBody] SubmitQuotationRequest request)
        {

            try {
            var result =
                await _repairOrderService.SubmitQuotationAsync(request);

            if (!result)
            {
                return BadRequest(
                    "The repair order was not found or already has a quotation.");
            }

            return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
