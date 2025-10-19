using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Enums
{
    public enum QuizRoomStatus
    {
        Waiting = 0,
        Starting = 1,
        InProgress = 2,
        Completed = 3,
        Cancelled = 4
    }
}
