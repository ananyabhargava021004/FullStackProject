#include <iostream>
using namespace std;
int sumTwoIntegers(int a, int b) {
    return a + b; 
}

int main() {
    int num1,num2;
    cin >> num1 >> num2;

    int result = sumTwoIntegers(num1, num2);

    cout << "The sum of " << num1 << " and " << num2 << " is: " << result << endl;

    return 0;
}