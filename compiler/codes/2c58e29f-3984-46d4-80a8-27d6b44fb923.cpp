#include <iostream> // Required for input/output operations

int main() {
    // Declare integer variables to store the two numbers and their sum
    int num1, num2, sum;

    // Prompt the user to enter the first integer
    std::cout << "Enter the first integer: ";
    // Read the first integer from the user's input
    std::cin >> num1;

    // Prompt the user to enter the second integer
    std::cout << "Enter the second integer: ";
    // Read the second integer from the user's input
    std::cin >> num2;

    // Calculate the sum of the two integers
    sum = num1 + num2;

    // Display the calculated sum to the user
    std::cout << "The sum of " << num1 << " and " << num2 << " is: " << sum << std::endl;

    // Indicate successful program execution
    return 0;
}