const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;

export const registerUser = async (formData) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, data };
    } else {
      return {
        success: false,
        message: data.message || "Registration failed. Please try again.",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, data };
    } else {
      return {
        success: false,
        message: data.message || "Login failed. Please try again.",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
};

export const fetchUsers = async ({
  page = 1,
  limit = 10,
  status = "",
  role = "",
}) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return { success: false, message: "No authentication token found" };
    }

    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(role && { role }),
    }).toString();

    const response = await fetch(
      `${ADMIN_API_URL}/users?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, data: data.data };
    } else {
      return {
        success: false,
        message: data.message || "Failed to fetch users",
      };
    }
  } catch (error) {
    console.error("Fetch users error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
};

export const approveUser = async (userId) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return { success: false, message: "No authentication token found" };
    }

    const response = await fetch(
      `${ADMIN_API_URL}/approve/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, data };
    } else {
      return {
        success: false,
        message: data.message || "Failed to approve user",
      };
    }
  } catch (error) {
    console.error("Approve user error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
};

export const rejectUser = async (userId) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return { success: false, message: "No authentication token found" };
    }

    const response = await fetch(
      `${ADMIN_API_URL}/reject/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, data };
    } else {
      return {
        success: false,
        message: data.message || "Failed to reject user",
      };
    }
  } catch (error) {
    console.error("Reject user error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
};