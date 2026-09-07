using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TVRepair.Api.data
{
    public record ApiResponse<T>(
        bool Success,
        int ErrorCode,
        string Message,
        T? Data = default
    );
}