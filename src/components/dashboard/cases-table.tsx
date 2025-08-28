'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Case } from '@/types/database'
import { createClientComponentClient } from '@/lib/supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react'

export function CasesTable() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCase, setEditingCase] = useState<Case | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      setLoading(true)
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('available_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setCases(data || [])
      }
    } catch (err) {
      setError('Failed to fetch cases')
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.url
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !editingCase) return

    setUploadingImages(true)
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file))
      const uploadedUrls = await Promise.all(uploadPromises)

      const updatedImages = [...editingCase.images, ...uploadedUrls]
      setEditingCase({
        ...editingCase,
        images: updatedImages
      })
    } catch (error) {
      console.error('Failed to upload images:', error)
      setError('Failed to upload images')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    if (!editingCase) return

    const updatedImages = editingCase.images.filter((_, index) => index !== indexToRemove)
    setEditingCase({
      ...editingCase,
      images: updatedImages
    })
  }

  const updateCase = async (updatedCase: Case) => {
    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase
        .from('cases')
        .update(updatedCase)
        .eq('id', updatedCase.id)

      if (error) {
        throw error
      }

      // Refresh the cases list
      await fetchCases()
      setEditingCase(null)
    } catch (error) {
      console.error('Failed to update case:', error)
      setError('Failed to update case')
    }
  }

  const getStatusBadge = (status: Case['status']) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      archived: 'destructive',
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getVisibilityIcon = (isVisible: boolean) => {
    return isVisible ? (
      <Eye className="h-4 w-4 text-green-500" />
    ) : (
      <EyeOff className="h-4 w-4 text-gray-400" />
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading cases...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-500 mb-2">Error loading cases</div>
            <div className="text-sm text-muted-foreground">{error}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchCases}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (cases.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="text-muted-foreground mb-4">No cases found</div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Case
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {cases.length} cases
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Case
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Logo</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Case Title</TableHead>
            <TableHead>Object Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Main Image</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((caseItem) => (
            <TableRow key={caseItem.id}>
              <TableCell>
                <div className="relative w-12 h-12 rounded overflow-hidden">
                  <Image
                    src={caseItem.company_logo}
                    alt={caseItem.company_name}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{caseItem.company_name}</TableCell>
              <TableCell className="font-medium">{caseItem.case_title}</TableCell>
              <TableCell>
                <Badge variant="outline">{caseItem.object_type}</Badge>
              </TableCell>
              <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getVisibilityIcon(caseItem.is_visible)}
                  <span className="ml-2 text-sm">
                    {caseItem.is_visible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                {caseItem.address}
              </TableCell>
              <TableCell>
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  <Image
                    src={caseItem.images[0] || '/placeholder-image.jpg'}
                    alt={caseItem.case_title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingCase(caseItem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Case Modal */}
      <Dialog open={!!editingCase} onOpenChange={() => setEditingCase(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Case</DialogTitle>
            <DialogDescription>
              Update case information and manage images.
            </DialogDescription>
          </DialogHeader>

          {editingCase && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input
                    value={editingCase.company_name}
                    onChange={(e) => setEditingCase({
                      ...editingCase,
                      company_name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Case Title</label>
                  <Input
                    value={editingCase.case_title}
                    onChange={(e) => setEditingCase({
                      ...editingCase,
                      case_title: e.target.value
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={editingCase.description}
                  onChange={(e) => setEditingCase({
                    ...editingCase,
                    description: e.target.value
                  })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Input
                    value={editingCase.address}
                    onChange={(e) => setEditingCase({
                      ...editingCase,
                      address: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Object Type</label>
                  <Input
                    value={editingCase.object_type}
                    onChange={(e) => setEditingCase({
                      ...editingCase,
                      object_type: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Company Logo */}
              <div>
                <label className="block text-sm font-medium mb-2">Company Logo URL</label>
                <Input
                  value={editingCase.company_logo}
                  onChange={(e) => setEditingCase({
                    ...editingCase,
                    company_logo: e.target.value
                  })}
                  placeholder="https://example.com/logo.png"
                />
                {editingCase.company_logo && (
                  <div className="mt-2">
                    <Image
                      src={editingCase.company_logo}
                      alt="Company logo preview"
                      width={60}
                      height={60}
                      className="rounded object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Images Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium">Case Images</label>
                  <div>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImages}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploadingImages}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingImages ? 'Uploading...' : 'Upload Images'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {editingCase.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={imageUrl}
                        alt={`Case image ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-visible"
                  checked={editingCase.is_visible}
                  onChange={(e) => setEditingCase({
                    ...editingCase,
                    is_visible: e.target.checked
                  })}
                  className="rounded"
                />
                <label htmlFor="is-visible" className="text-sm font-medium">
                  Case is visible on website
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingCase(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateCase(editingCase)}
                  disabled={uploadingImages}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
