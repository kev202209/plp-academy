def calculate_discount(price, discount_percent):
    if discount_percent >= 20:
        discount_amount = (discount_percent / 100) * price
        final_price = price - discount_amount
        return final_price
    else:
        return price

try:
    price = float(input("Enter the original price of the item then press enter: "))
    discount_percent = float(input("Enter the discount percentage then press enter: "))

    final_price = calculate_discount(price, discount_percent)

    print("Final price:", final_price)

except ValueError:
    print("Error: Invalid input. Please enter numeric values for price and discount percentage.")