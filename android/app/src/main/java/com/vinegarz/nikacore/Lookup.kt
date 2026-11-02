package com.vinegarz.nikacore

data class CallerMatch(
    val phone: String,
    val name: String,
    val spamScore: Int,
    val isTestData: Boolean
)

object LocalDirectory {
    private val records = listOf(
        CallerMatch("+919876512345", "TEST DATA · Rahul Sharma", 0, true),
        CallerMatch("+919988777665", "TEST DATA · Delivery Service", 12, true),
        CallerMatch("+919123456789", "TEST DATA · Reported caller", 92, true)
    )

    fun lookup(phone: String): CallerMatch? {
        val normalized = phone.filter(Char::isDigit).let { "+$it" }
        return records.firstOrNull { it.phone == normalized }
    }
}
