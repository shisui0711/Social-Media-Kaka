
using System.Text.RegularExpressions;

namespace Application.Statistics.CreateSearchLog
{
    public class CreateSearchLogValidator : AbstractValidator<CreateSearchLogCommand>
    {
        public CreateSearchLogValidator()
        {
            RuleFor(x => x.KeyWord).Must(IsValidKeyword).WithMessage("Invalid Keyword");
        }

        private bool IsValidKeyword(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return false;

            // 1. Độ dài hợp lý
            if (keyword.Length < 3 || keyword.Length > 20)
                return false;

            // 2. Chỉ chứa chữ cái và số
            if (!Regex.IsMatch(keyword, @"^[a-zA-Z0-9]+$"))
                return false;

            // 3. Kiểm tra tỷ lệ nguyên âm/phụ âm
            int vowels = Regex.Matches(keyword, "[aeiouAEIOU]").Count;
            int consonants = keyword.Length - vowels;

            if (vowels == 0 || consonants == 0)
                return false;

            double ratio = (double)vowels / consonants;
            if (ratio < 0.2 || ratio > 5) // Tỉ lệ không hợp lý
                return false;

            return true;
        }
    }
}