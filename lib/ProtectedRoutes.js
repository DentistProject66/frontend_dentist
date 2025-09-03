// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode";

// const ProtectedRoute = (Component) => {
//   return function ProtectedComponent(props) {
//     const router = useRouter();
//     const [isAuthorized, setIsAuthorized] = useState(null);

//     useEffect(() => {
//       const checkAuth = () => {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           console.log("No token found, redirecting to /sign_in");
//           router.push("/sign_in");
//           return;
//         }

//         try {
//           const decoded = jwtDecode(token);
//           console.log("Decoded token:", decoded); // Debug token contents
//           if (decoded.role === "admin" || decoded.role === "super_admin") {
//             console.log("Authorized role:", decoded.role);
//             setIsAuthorized(true);
//             router.push("/admin/approval");
//           } else {
//             console.log("Role not admin or super_admin:", decoded.role);
//             setIsAuthorized(false);
//             router.push("/sign_in");
//           }
//         } catch (error) {
//           console.error("Token decode error:", error);
//           setIsAuthorized(false);
//           router.push("/sign_in");
//         }
//       };

//       checkAuth();
//     }, [router]);

//     if (isAuthorized === null) {
//       return <div>Loading...</div>;
//     }

//     if (!isAuthorized) {
//       return null;
//     }

//     return <Component {...props} />;
//   };
// };

// export default ProtectedRoute;



"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = (Component, allowedRoles = []) => {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/sign_in");
          return;
        }

        try {
          const decoded = jwtDecode(token);

          if (allowedRoles.length === 0 || allowedRoles.includes(decoded.role)) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            router.push("/unauthorized"); // You can make a page for "Access Denied"
          }
        } catch (error) {
          setIsAuthorized(false);
          router.push("/sign_in");
        }
      };

      checkAuth();
    }, [router]);

    if (isAuthorized === null) {
      return <div>Loading...</div>;
    }

    if (!isAuthorized) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default ProtectedRoute;
