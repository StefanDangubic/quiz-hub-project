using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
            Task<IEnumerable<Category>> GetAllWithQuizCountAsync();
 
    }
}
