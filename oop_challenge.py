# Activity 1: Smartphone Class with Inheritance

class Smartphone:
    def __init__(self, brand, model, storage, battery_level):
        self.brand = brand
        self.model = model
        self.storage = storage
        self.battery_level = battery_level

    def make_call(self, number):
        print(f"Calling {number} from my {self.brand} {self.model}...")
        self.battery_level -= 2  # Simulate battery drain
        if self.battery_level < 0:
            self.battery_level = 0
            print("Battery depleted.")

    def check_battery(self):
        print(f"Battery level: {self.battery_level}%")

    def __str__(self):
        return f"{self.brand} {self.model}, Storage: {self.storage}GB, Battery: {self.battery_level}%"


class GamingSmartphone(Smartphone):
    def __init__(self, brand, model, storage, battery_level, cooling_system):
        super().__init__(brand, model, storage, battery_level)
        self.cooling_system = cooling_system

    def play_game(self, game_name):
        print(f"Playing {game_name} on my {self.brand} {self.model} with {self.cooling_system} cooling...")
        self.battery_level -= 10  # Gaming drains more battery
        if self.battery_level < 0:
            self.battery_level = 0
            print("Battery depleted.")

    def __str__(self):
        return super().__str__() + f", Cooling: {self.cooling_system}"


# Example usage for activity 1
my_phone = Smartphone("Google", "Tecno", 128, 80)
gaming_phone = GamingSmartphone("HP", "Thinkpad", 512, 100, "fan")

print(my_phone)
my_phone.make_call("555-1234")
my_phone.check_battery()

print(gaming_phone)
gaming_phone.play_game("Genshin Impact")
gaming_phone.check_battery()





# Activity 2: Polymorphism Challenge

class Animal:
    def move(self):
        pass  # Abstract method


class Dog(Animal):
    def move(self):
        print("Running on four legs! 🐾")


class Bird(Animal):
    def move(self):
        print("Flying through the sky! ✈️")


class Fish(Animal):
    def move(self):
        print("Swimming in the water! 🐟")

class Car:
    def move(self):
        print("Driving on the road! 🚗")

class Plane:
    def move(self):
        print("Flying in the air! ✈️")

# Example of this
dog = Dog()
bird = Bird()
fish = Fish()
car = Car()
plane = Plane()

animals = [dog, bird, fish, car, plane]

for animal in animals:
    animal.move()