
namespace Application.Users.Commands.ChangeBirthDay
{
    public class ChangeBirthDayCommandValidator : AbstractValidator<ChangeBirthDayCommand>
    {
        public ChangeBirthDayCommandValidator()
        {
            RuleFor(x=>x.BirhtDay).GreaterThanOrEqualTo(new DateTime(1900,1,1)).WithMessage("Invalid Birthday");
            RuleFor(x=>x.BirhtDay).LessThanOrEqualTo(DateTime.Now).WithMessage("Invalid Birthday");
        }
    }
}