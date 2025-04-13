"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Category {
  id: number
  name: string
}

export function CategoryManagement() {
  const { toast } = useToast()
  const token = localStorage.getItem('token')
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast({
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    }
  }

  const handleCreate = async () => {
    if (!newCategory.trim()) return

    try {
      const response = await fetch(`${API_URL}/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategory }),
      })

      if (response.ok) {
        toast({
          description: "Category created successfully",
        })
        setNewCategory("")
        fetchCategories()
      } else {
        throw new Error('Failed to create category')
      }
    } catch (error) {
      toast({
        description: "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (category: Category) => {
    try {
      const response = await fetch(`${API_URL}/category/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: category.name }),
      })

      if (response.ok) {
        toast({
          description: "Category updated successfully",
        })
        setEditingCategory(null)
        fetchCategories()
      } else {
        throw new Error('Failed to update category')
      }
    } catch (error) {
      toast({
        description: "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/category/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      if (response.ok) {
        toast({
          description: "Category deleted successfully",
        })
        fetchCategories()
      } else {
        throw new Error('Failed to delete category')
      }
    } catch (error) {
      toast({
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Category Management</h2>
      
      {/* Create Category Form */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
            {editingCategory?.id === category.id ? (
              <div className="flex gap-4 flex-1">
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="flex-1"
                />
                <Button onClick={() => handleUpdate(editingCategory)}>
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <span className="text-lg">{category.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 