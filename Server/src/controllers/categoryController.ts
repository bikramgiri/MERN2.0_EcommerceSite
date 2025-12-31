import Category from "../database/models/categoryModel";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
      categoryDescription:
        "Devices and gadgets including smartphones, laptops, and accessories.",
    },
    {
      categoryName: "Food & Beverages",
      categoryDescription:
        "Groceries, snacks, drinks, and other consumables.",
    },
      {
      categoryName: "Home & Kitchen",
      categoryDescription:
        "Appliances, furniture, and decor for your living spaces.",
      },
  ];
  async seedCategory(): Promise<void> {
      const Datas = await Category.findAll()
      if(Datas.length === 0){
            await Category.bulkCreate(this.categoryData);
            console.log("Categories seeded successfully.");
      } else {
            console.log("Categories already seeded.");
      }
  }
}

export default new CategoryController() 
