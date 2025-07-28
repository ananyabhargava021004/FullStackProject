#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    int x = 5, y = 7;
    cout << "Sum = " << add(x, y) << endl; // Output: Sum = 12
    return 0;
}
