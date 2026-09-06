using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using TVRepair.Api.data;
using TVRepair.Api.model;

namespace TVRepair.Api.apicontroller
{
    [ApiController]
    [Route("api/[controller]")]
    public class TVRepairController : ControllerBase
    {
        
        public readonly TVRepairDBContext _context;

        public TVRepairController(TVRepairDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddRepairOrder")]
        public async Task<ActionResult> AddRepairOrder([FromForm]RepairOrder request )
        {
            try 
            {
                if(request==null)
                return BadRequest();

                request.Id = Guid.NewGuid();
                request.CreatedDate = DateTime.Now;
                request.Status = "OrderPlace"; //assign default value when orderplaced
            
                _context.RepairOrder.Add(request);
                await _context.SaveChangesAsync();

                var statushistory = new RepairOrderStatusHistory
                {
                    RepairOrderID = request.Id,
                    Status = request.Status,
                    UpdatedDate = DateTime.Now
                };

                _context.RepairOrderStatusHistory.Add(statushistory);
                await _context.SaveChangesAsync();

                return Created();
            }

            catch(Exception ex)
            {
                throw (ex);
            }
            
        }

        [HttpGet("GetRepairOrder")]
        public async Task<ActionResult<List<GetRepairOrderResponse>>> GetRepairOrder(string UserName)
        {
            if (UserName==null)
            return BadRequest();
            
            // var repairorderlist = await _context.RepairOrder.Where(a=>a.UserName == UserName).AsNoTracking().ToListAsync();

            var repairorderlist = await _context.Database.SqlQuery<GetRepairOrderResponse>($"EXEC dbo.GetRepairOrderTechnician @UserName={UserName}").ToListAsync();

            if(repairorderlist==null)
            return BadRequest();

            else return Ok(repairorderlist);
        }


        [HttpGet("GetRepairOrderTechnician")]
        public async Task<ActionResult<List<RepairOrder>>> GetRepairOrderTechnician (string Area,string TechnicianID)
        {
            try {
            var orderlist = await _context.RepairOrder.Where
            (x=> (x.Area==Area && x.Status == "OrderPlace") || (x.TechnicianId ==TechnicianID ))
            .AsNoTracking().ToListAsync();
            return Ok(orderlist);

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }


        [HttpPost("AcceptRepairOrderTechnician")]
        public async Task<ActionResult<List<RepairOrder>>> AcceptRepairOrderTechnician (Guid Id, string TechnicianId)
        {
            if (Id == null)
            return BadRequest("Id empty");

            if (TechnicianId == null)
            return BadRequest("technician id empty");

            try {
            
            var updateorder = _context.RepairOrder.FirstOrDefault(x=>x.Id == Id);

            if(updateorder==null)
            return BadRequest("Data is null");

            updateorder.Status = "Accepted";
            updateorder.TechnicianId = TechnicianId;
            _context.SaveChanges();

            var statushistory = new RepairOrderStatusHistory
            {
                RepairOrderID = Id,
                Status = updateorder.Status,
                UpdatedDate = DateTime.Now
            };

            _context.RepairOrderStatusHistory.Add(statushistory);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = updateorder.Id,
                TechnicianId = updateorder.TechnicianId,
                Status = updateorder.Status
            }
            );
            }

            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("MatchRepairOrderTechnician")]
        public async Task <ActionResult<List<RepairOrder>>> MatchRepairOrderTechnician ()
        {

            return Ok();
        }


        [HttpPost("UpdateJob")]
        public async Task <ActionResult> UpdateJob ([FromForm] UpdateJobRequest request)
        {
            try {

                if (request==null)
                return BadRequest();

                var updatejob = _context.RepairOrder.Where(x=>x.Id == request.RepairOrderId).FirstOrDefault();

                updatejob.Status = request.Status;
                updatejob.OrderNotes = request.RepairNotes;

                await _context.SaveChangesAsync();
                return Ok(updatejob);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("SubmitQuotation")]
        public async Task <ActionResult> SubmitQuotation (SubmitQuotationRequest request)
        {   
            try {

            var quotationlist = _context.Quotation.FirstOrDefault(x=>x.RepairOrderId == request.RepairOrderId);

            if (quotationlist!=null)
            return BadRequest();

            var quotation = new Quotation
            {
                RepairOrderId = request.RepairOrderId,
                QuotationDesc = request.QuotationDesc,
                Amount = Convert.ToInt32(request.Amount),
                CustomerId = request.CustomerId,
                TechnicianId = request.TechnicianId
            };

            _context.Add(quotation);

            var updateorder = _context.RepairOrder.FirstOrDefault(x=>x.Id == request.RepairOrderId);

            updateorder.Status = "Quotation"; 

            await _context.SaveChangesAsync();

            return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }
        

    }
}