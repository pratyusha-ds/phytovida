import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/ui/components/dialog'
import { useState } from 'react';
import { useNavigate } from 'react-router';

const FeedbackCard = ({ icon, title, description, actions }: {
    icon: { icon: React.ReactNode, bgColor: string };
    title: string;
    description: { text: string, color: string };
    actions?: { link: string, text: string, bgColor: string, color: string }[]

}) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <div className={`p-2 ${icon.bgColor} text-white rounded-full w-max box-shadow-lg`}>
                        {icon.icon}
                    </div>
                    <DialogTitle className="2xl">{title}</DialogTitle>
                    <DialogDescription className={`${description.color}`}>
                        {description.text}
                    </DialogDescription>
                </DialogHeader>
                {
                    actions && (
                        <div className="flex flex-col md:flex-row gap-2">
                            {actions.map((action, index) => (
                                <Button
                                    onClick={() => { setOpen(false); navigate(action.link) }}
                                    key={index} variant="secondary" className={`${action.bgColor} hover:${action.bgColor} focus:ring-${action.bgColor} ${action.color} flex-1`}>
                                    {action.text}
                                </Button>
                            ))}
                        </div>
                    )}
            </DialogContent>
        </Dialog>
    )
}

export default FeedbackCard
