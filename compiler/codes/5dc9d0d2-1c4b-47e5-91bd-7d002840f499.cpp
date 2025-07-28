#include <iostream> // Required for input/output operations

// Function to calculate the sum of two integers
int sumTwoIntegers(int a, int b) {
    return a + b; // Returns the sum of 'a' and 'b'
}

int main() {
    int num1 = 5;
    int num2 = 10;
    int result = sumTwoIntegers(num1, num2); // Call the function

    std::cout << "The sum of " << num1 << " and " << num2 << " is: " << result << std::endl;

    // Example with different numbers
    std::cout << "The sum of 7 and 3 is: " << sumTwoIntegers(7, 3) << std::endl;

    return 0;
}