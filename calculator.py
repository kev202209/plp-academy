def simple_calculator(value1, value2, operator):
    if operator == '+':
        return value1 + value2
    elif operator == '-':
        return value1 - value2
    elif operator == '*':
        return value1 * value2
    elif operator == '/':
        if value2 == 0:
            print("Error: Division by zero.")
            return None
        return value1 / value2
    else:
        print("Error: Invalid operator.")
        return None
try:
    value1 = float(input("Enter the first value: "))
    value2 = float(input("Enter the second value: "))
    operator = input("Enter the operator (+, -, *, /): ")
    result = simple_calculator(value1, value2, operator)
    if result is not None:
        print(f"{value1} {operator} {value2} = {result}")
except ValueError:
    print("Error: Invalid input. Please enter numbers for the values.")